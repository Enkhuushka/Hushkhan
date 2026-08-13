export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(n: number) {
  return n.toLocaleString("mn-MN").replace(/,/g, " ") + "₮";
}
