type Props = {
  ip: string;
  location: string;
};

const UserIP = ({ ip, location }: Props) => {
  return (
    <div className="text-center">
      <b>Your Current IP:</b>
      <p>{ip}</p>
      <p className="opacity-75">{location}</p>
    </div>
  );
};

export default UserIP;
