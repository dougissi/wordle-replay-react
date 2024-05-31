import Page from "./Page";
import Markdown from "../Markdown";

export default function AboutPage() {
    return (
        <Page
            title="About"
            content={<Markdown fileName={"about.md"} />}
        />
    );
}
