type Props = {
  children: React.ReactNode;
};

export default function Sheet({ children }: Props) {
  return <main>{children}</main>;
}
