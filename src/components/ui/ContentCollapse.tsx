import { Collapse } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

interface ContentCollapseProps {
  str: string;
  visibleLength?: number;
  textStyle?: string;
}

const ContentCollapse = ({
  str,
  visibleLength = 50,
  textStyle,
}: ContentCollapseProps) => {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <div>
      <p className={textStyle || ""}>
        {str.slice(0, visibleLength)}
        {!opened && str.length > visibleLength && " . . ."}{" "}
        {/* Show ellipsis when content is truncated */}
      </p>
      <Collapse in={opened}>
        <p className={textStyle || ""}>{str.slice(visibleLength)}</p>
      </Collapse>
      {str.length > visibleLength && (
        <span className="text-base font-bold cursor-pointer" onClick={toggle}>
          {opened ? "View Less" : "View More"}
        </span>
      )}
    </div>
  );
};

export default ContentCollapse;
