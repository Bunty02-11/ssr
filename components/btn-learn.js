import PropTypes from "prop-types";

const BtnLearn = ({ className = "", property1 = "Default" }) => {
  return (
    <div
      className={`rounded-[100px] bg-[#fff] overflow-hidden flex flex-row items-center justify-center py-3 px-10 text-center text-base text-[#000] font-h5-24 mq450:w-[80px] mq450:px-6 mq450:py-2 mq450:text-[14px] cursor-pointer ${className}`}
      data-property1={property1}
    >
      <div className="relative leading-[150%] font-medium">Learn More</div>
    </div>
  );
};

BtnLearn.propTypes = {
  className: PropTypes.string,

  /** Variant props */
  property1: PropTypes.number,
};

export default BtnLearn;
