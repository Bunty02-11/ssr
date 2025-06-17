import PropTypes from "prop-types";

const BtnRead = ({ className = "", property1 = "Default", onClick }) => {
  return (
    <div
      className={`rounded-[100px] bg-[#000] overflow-hidden flex flex-row items-center justify-center py-3 px-10 text-center text-base text-[#fff] font-h5-24 cursor-pointer mq450:w-[80px] mq450:px-6 mq450:py-2 mq450:text-[14px] ${className}`}
      data-property1={property1}
      onClick={onClick}
    >
      <div className="relative leading-[150%] font-medium">Read More</div>
    </div>
  );
};

BtnRead.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  /** Variant props */
  property1: PropTypes.number,
};

export default BtnRead;
