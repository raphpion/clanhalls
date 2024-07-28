type Props = {
  size?: number;
};

function Logo({ size = 32 }: Props) {
  return <img src="/logo.svg" alt="logo" width={size} />;
}

export default Logo;
