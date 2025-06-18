import Image from "next/image";
import Component1 from "./component1";
import PropTypes from "prop-types";

const Content = ({ className = "" }) => {
  return (
    <section
      className={`self-stretch flex flex-col items-start justify-start p-10 box-border gap-6 max-w-full text-left text-base text-[#fff] font-h5-24 mq450:pt-5 mq450:pb-5 mq450:box-border mq1125:pt-[26px] mq1125:pb-[26px] mq1125:box-border ${className}`}
    >
      <div className="self-stretch flex flex-col items-start justify-start gap-4 text-21xl">
        <h1 className="m-0 self-stretch relative text-inherit leading-[120%] font-medium font-[inherit] mq750:text-13xl mq750:leading-[38px] mq1050:text-5xl mq1050:leading-[29px]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h1>
        <div className="self-stretch relative text-base leading-[150%] font-medium">
          31 Jan 2025 - by Admin
        </div>
      </div>
      <Image
        className="self-stretch h-[600px] relative rounded-3xl max-w-full overflow-hidden shrink-0 object-cover"
        loading="lazy"
        width={1360}
        height={600}
        alt="image@2x"
        src="/image@2x.webp"
      />
      <div className="self-stretch flex flex-col items-center justify-start gap-4">
        <div className="self-stretch relative leading-[150%] font-medium">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
          turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec
          fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus
          elit sed risus. Maecenas eget condimentum velit, sit amet feugiat
          lectus. Class aptent taciti sociosqu ad litora torquent per conubia
          nostra, per inceptos himenaeos. Praesent auctor purus luctus enim
          egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex.
          Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum
          lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in
          elementum tellus.
        </div>
        <div className="self-stretch relative leading-[150%] font-medium">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
          turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec
          fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus
          elit sed risus. Maecenas eget condimentum velit, sit amet feugiat
          lectus. Class aptent taciti sociosqu ad litora torquent per conubia
          nostra, per inceptos himenaeos. Praesent auctor purus luctus enim
          egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex.
          Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum
          lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in
          elementum tellus.
        </div>
      </div>
      <div className="self-stretch flex flex-row items-start justify-center gap-10 max-w-full text-center mq750:gap-5 mq750:grid-cols-[minmax(320px,_1fr)] mq450:justify-center mq450:grid-cols-[repeat(2,_minmax(320px,_555px))] mq1125:flex-wrap">
        <Component1 iconChevronright="/5@2x.webp" />
        <Component1 iconChevronright="/5@2x.webp" />
        <Component1 iconChevronright="/5@2x.webp" />
      </div>
      <div className="self-stretch flex flex-col items-center justify-start gap-4">
        <div className="self-stretch relative leading-[150%] font-medium">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
          turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec
          fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus
          elit sed risus. Maecenas eget condimentum velit, sit amet feugiat
          lectus. Class aptent taciti sociosqu ad litora torquent per conubia
          nostra, per inceptos himenaeos. Praesent auctor purus luctus enim
          egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex.
          Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum
          lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in
          elementum tellus.
        </div>
        <div className="self-stretch relative leading-[150%] font-medium">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
          turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec
          fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus
          elit sed risus. Maecenas eget condimentum velit, sit amet feugiat
          lectus. Class aptent taciti sociosqu ad litora torquent per conubia
          nostra, per inceptos himenaeos. Praesent auctor purus luctus enim
          egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex.
          Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum
          lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in
          elementum tellus.
        </div>
      </div>
      <div className="self-stretch flex flex-col items-start justify-start gap-4">
        <div className="self-stretch relative border-[rgba(255,255,255,0.08)] border-solid border-t-[1px] box-border h-px" />
        <div className="flex flex-row items-start justify-start gap-3">
          <Image
            className="h-6 w-6 relative overflow-hidden shrink-0"
            loading="lazy"
            width={24}
            height={24}
            alt="icon--facebook1"
            src="/icon--facebook1.svg"
          />
          <Image
            className="h-6 w-6 relative overflow-hidden shrink-0"
            loading="lazy"
            width={24}
            height={24}
            alt="icon--instagram1"
            src="/icon--instagram1.svg"
          />
          <Image
            className="h-6 w-6 relative overflow-hidden shrink-0"
            loading="lazy"
            width={24}
            height={24}
            alt="icon--x1"
            src="/icon--x1.svg"
          />
          <Image
            className="h-6 w-6 relative overflow-hidden shrink-0"
            loading="lazy"
            width={24}
            height={24}
            alt="icon--linkedin1"
            src="/icon--linkedin1.svg"
          />
          <Image
            className="h-6 w-6 relative overflow-hidden shrink-0"
            loading="lazy"
            width={24}
            height={24}
            alt="icon--youtube3"
            src="/icon--youtube3.svg"
          />
        </div>
        <div className="self-stretch relative border-[rgba(255,255,255,0.08)] border-solid border-t-[1px] box-border h-px" />
      </div>
    </section>
  );
};

Content.propTypes = {
  className: PropTypes.string,
};

export default Content;
