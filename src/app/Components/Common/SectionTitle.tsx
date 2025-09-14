import parse from "html-react-parser";
import Image from "next/image";

const SectionTitle = ({
  Title,
  SubTitle,
}: {
  Title: string;
  SubTitle: string;
}) => {
  return (
    <div>
      <div className="subtitle wow fadeInUp" data-wow-delay=".2s">
        {parse(SubTitle)}{" "}
        <Image
          src="/assets/images/icon/fireIcon.svg"
          alt="icon"
          width={20}
          height={20}
        />
      </div>
      <h2 className="title wow fadeInUp" data-wow-delay=".4s">
        {parse(Title)}
      </h2>
    </div>
  );
};

export default SectionTitle;
