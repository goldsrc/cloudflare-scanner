type Props = {
  ip: string;
  location: string;
};

const UserIP = ({ ip, location }: Props) => {
  return (
    <div className="text-center">
      <b>Your Current IP:</b>
      <p>
        {ip} ({location})
      </p>
    </div>
  );
};

export default UserIP;
