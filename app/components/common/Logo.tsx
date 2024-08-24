import clsx from "clsx";
import { FileChartLineIcon } from "lucide-react";

type Props = {
  gradientSize?: string;
  iconSize?: string;
};

export const Logo = ({
  gradientSize = "w-16 h-16",
  iconSize = "w-10 h-10",
}: Props) => {
  return (
    <div
      className={clsx(
        "bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center ",
        gradientSize
      )}
    >
      <FileChartLineIcon className={clsx("text-white", iconSize)} />
    </div>
  );
};
