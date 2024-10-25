export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" flex items-center justify-center  min-h-full sm:h-[calc(100svh-59.2px)] sm:min-h-0">
      {children}
    </div>
  );
}
