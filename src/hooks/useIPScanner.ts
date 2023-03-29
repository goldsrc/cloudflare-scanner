import { create } from "zustand";
import { persist } from "zustand/middleware";
import { randomizeElements } from "~/helpers/randomizeElements";
import pick from "lodash/pick";

type ValidIP = {
  ip: string;
  latency: number;
};

const TRY_CHARS = ["", "|", "/", "-", "\\"] as const;
const MAX_TRIES = TRY_CHARS.length;
export type TryChar = (typeof TRY_CHARS)[number];

export type Settings = {
  maxIPCount: number;
  maxLatency: number;
  ipRegex: string;
};

type SettingKeys = keyof Settings;

type ScanState = "idle" | "stopping" | "scanning";

type ScannerStore = Settings & {
  testNo: number;
  validIPs: ValidIP[];
  currentIP: string;
  tryChar: TryChar;
  currentLatency: number;
  color: "red" | "green";
  scanState: ScanState;
  dispatch: (newState: Partial<ScannerStore>) => void;
  reset: () => void;
  increaseTestNo: () => void;
  addValidIP: (validIP: ValidIP) => void;
  setSettings: (newSettings: Partial<Settings>) => void;
  getScanState: () => ScanState;
  getValidIPCount: () => number;
};

type FunctionalKeys = {
  [K in keyof ScannerStore]: ScannerStore[K] extends (
    ...args: never[]
  ) => unknown
    ? K
    : never;
}[keyof ScannerStore];

export const settingsInitialValues: Pick<ScannerStore, SettingKeys> = {
  maxIPCount: 5,
  maxLatency: 1000,
  ipRegex: "",
};

const initialState: Omit<ScannerStore, FunctionalKeys> = {
  ...settingsInitialValues,
  testNo: 0,
  validIPs: [],
  currentIP: "",
  tryChar: "",
  currentLatency: 0,
  color: "red",
  scanState: "idle",
};

export const useScannerStore = create<ScannerStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      getScanState: () => get().scanState,
      getValidIPCount: () => get().validIPs.length,
      setSettings: (newSettings) => {
        set(newSettings);
      },
      dispatch: (newState) => {
        set(newState);
      },
      addValidIP(validIP) {
        set((state) => {
          const newArr = [...state.validIPs, validIP];
          const validIPs = newArr.sort((a, b) => a.latency - b.latency);
          return {
            validIPs,
          };
        });
      },
      reset: () => {
        set({
          testNo: 0,
          validIPs: [],
          currentIP: "",
          tryChar: "",
          currentLatency: 0,
          color: "red",
          scanState: "idle",
        });
      },
      increaseTestNo: () => {
        set((state) => ({ testNo: state.testNo + 1 }));
      },
    }),
    {
      name: "scanner-store",
      partialize: (state) => pick(state, Object.keys(settingsInitialValues)),
      version: 1,
    }
  )
);

type IPScannerProps = {
  allIps: string[];
};

export const useIPScanner = ({ allIps }: IPScannerProps) => {
  const {
    dispatch,
    reset,
    increaseTestNo,
    addValidIP,
    getScanState,
    getValidIPCount,
    ...state
  } = useScannerStore();
  function setToIdle() {
    dispatch({ scanState: "idle", tryChar: "" });
  }
  async function startScan() {
    reset();
    try {
      const ips = state.ipRegex
        ? allIps.filter((el) => new RegExp(state.ipRegex).test(el))
        : allIps;

      dispatch({ scanState: "scanning" });
      await testIPs(randomizeElements(ips));
      setToIdle();
    } catch (e) {
      console.error(e);
    }
  }

  function stopScan() {
    if (getScanState() === "scanning") {
      dispatch({ scanState: "stopping" });
    } else {
      setToIdle();
    }
  }

  async function testIPs(ipList: string[]) {
    for (const ip of ipList) {
      increaseTestNo();
      const url = `https://${ip}/__down`;

      let testCount = 0;

      const startTime = performance.now();
      const multiply =
        state.maxLatency <= 500 ? 1.5 : state.maxLatency <= 1000 ? 1.2 : 1;
      let timeout = 1.5 * multiply * state.maxLatency;
      for (let i = 0; i < MAX_TRIES; i++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
        }, Math.trunc(timeout));
        const newState: Partial<ScannerStore> = {
          currentIP: ip,
          tryChar: TRY_CHARS[i] || "",
        };

        if (i === 0) {
          timeout = multiply * state.maxLatency;
          newState.color = "red";
          newState.currentLatency = 0;
        } else {
          timeout = 1.2 * multiply * state.maxLatency;
          newState.color = "green";
          newState.currentLatency = Math.floor(
            (performance.now() - startTime) / (i + 1)
          );
        }

        dispatch(newState);

        try {
          await fetch(url, {
            signal: controller.signal,
          });

          testCount++;
        } catch (error) {
          // don't increase testResult if it's not an abort error
          if (!(error instanceof Error && error.name === "AbortError")) {
            testCount++;
          }
        }
        clearTimeout(timeoutId);
      }

      const latency = Math.floor((performance.now() - startTime) / MAX_TRIES);

      if (testCount === MAX_TRIES && latency <= state.maxLatency) {
        addValidIP({
          ip,
          latency,
        });
      }

      if (
        getScanState() !== "scanning" ||
        getValidIPCount() >= state.maxIPCount
      ) {
        break;
      }
    }
  }

  return {
    ...state,
    startScan,
    stopScan,
  };
};
