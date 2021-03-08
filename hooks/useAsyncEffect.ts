import { useEffect } from "react";
type AsyncFunction<TResult> = () => Promise<TResult>;

export default <TResult>(
  action: AsyncFunction<TResult>,
  dependencies: any[],
  cleanup?: () => void
) => {
  useEffect(() => {
    action();

    if (cleanup) {
      return cleanup();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};
