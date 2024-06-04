import useScreenSize from "../useScreenSize";
import Page from "../Pages/Page";

export default function IFramePage({ title, src }) {
    const screenSize = useScreenSize();  // TODO: commonize with Game

    return (
        <Page
            title={title}
            content={
                <iframe
                    src={src}
                    width={screenSize.width * 0.8}
                    height={screenSize.height * 0.8}
                    style={{ border: 'none' }}
                ></iframe>
            }
        />
    );
}