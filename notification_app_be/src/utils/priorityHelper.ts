export function getPriority(type: string): number {
  switch (type) {
    case "Placement":
      return 3;

    case "Result":
      return 2;

    case "Event":
      return 1;

    default:
      return 0;
  }
}