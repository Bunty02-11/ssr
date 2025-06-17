import PropTypes from "prop-types";

const Cat = ({ className = "" }) => {
  return (
    <div
      className={`h-[500px] w-[400px] rounded-3xl flex flex-col items-start justify-end py-10 px-6 box-border gap-4 bg-[url('/cat@3x.webp')] bg-cover bg-no-repeat bg-[top] text-left text-base text-[#fff] font-h5-24 ${className}`}
    >
      <h1 className="m-0 self-stretch relative text-13xl leading-[130%] font-semibold font-[inherit]">
        Classic
      </h1>
      <div className="self-stretch relative leading-[150%] font-medium text-[rgba(255,255,255,0.8)]">
        Porem ipsum dolor sit amet, consectetur adipiscing elit.
      </div>
      <div className="rounded-[100px] bg-[#fff] overflow-hidden hidden flex-row items-center justify-center py-3 px-10 text-center text-[#000]">
        <div className="relative leading-[150%] font-medium">Shop Now</div>
      </div>
    </div>
  );
};

Cat.propTypes = {
  className: PropTypes.string,
};

export default Cat;
