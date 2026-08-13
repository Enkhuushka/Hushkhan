import { loadStaticHtml } from "@/lib/static-source";
import { OriginalPage } from "@/components/OriginalPage";

export default function Page() {
  const { head, body } = loadStaticHtml("/about/ingredients");
  return <OriginalPage head={head} body={body} />;
}
