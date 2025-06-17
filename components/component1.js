import Image from "next/image";
import PropTypes from "prop-types";

const Component1 = ({ className = "", iconChevronright }) => {
  return (
    <div
      className={`w-[426.7px] flex flex-col items-start justify-start gap-4 max-w-full text-center text-base text-[#fff] font-h5-24 ${className}`}
    >
      <Image
        className="self-stretch h-[400px] relative rounded-2xl max-w-full overflow-hidden shrink-0 object-cover"
        loading="lazy"
        width={427}
        height={400}
        alt=""
        src={iconChevronright}
      />
      <div className="self-stretch flex flex-col items-start justify-start">
        <div className="self-stretch relative leading-[150%] font-medium">
          Yorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
          vulputate libero et velit interdum, ac aliquet odio mattis. Class
          aptent taciti sociosqu ad litora torquent
        </div>
      </div>
    </div>
  );
};

Component1.propTypes = {
  className: PropTypes.string,
  iconChevronright: PropTypes.string.isRequired,
};

export default Component1;
