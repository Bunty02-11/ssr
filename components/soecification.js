import Image from "next/image";
import PropTypes from "prop-types";

const Specification = ({ className = "", product }) => {
  return (
    <section
      className={`w-[1360px] self-stretch overflow-hidden max-w-full flex flex-row mx-auto px-[8px] mq450:px-[8px] box-border text-left text-[#000] font-h5-24 items-center justify-center py:[60px] mq450:py-[40px] ${className}`}
    >
      <div className="pr-12 mq450:pr-0"> {/* Added padding-right container */}
        <Image
          className="h-[500px] w-[500px] mq1050:h-[350px] mq1050:w-[350px] rounded-3xl object-cover max-w-full mq1125:flex-1 mq450:hidden"
          width={500}
          height={500}
          alt="about_2"
          src="/about_2.webp"
          loading="lazy"
        />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-6 min-w-[520px] mq750:min-w-[400px]">
        <h1 className="m-0 self-stretch relative text-[56px] leading-[120%] font-bold font-[inherit] mq450:text-[34px] mq450:leading-[40px] mq1050:text-[45px] mq1050:leading-[54px]">
          Specifications
        </h1>
        <div className="self-stretch flex flex-row items-start text-left justify-start gap-6 text-[18px] font-[500] mq750:flex-wrap">
          <div className="flex-1 flex flex-col items-start justify-start gap-4 min-w-[244px]">
            <div className="self-stretch flex flex-row items-center justify-between gap-0 mq450:flex-wrap">
              <div className="relative text-left text-[18px] font-[500] leading-[150%] font-medium mq450:text-xs">
                Band Closure:
              </div>
              <div className="relative text-right text-[16px] font-[500] leading-[150%] font-medium mq450:text-xs">
                {product?.watchDetails?.bandClosure?.en}
              </div>
            </div>
            <div className="self-stretch flex text-[18px] font-[500] flex-row items-center justify-between gap-0 mq450:flex-wrap">
              <div className="relative text-left leading-[150%] font-medium mq450:text-xs">
                Band Material:
              </div>
              <div className="relative text-right text-left text-[16px] font-[500]  leading-[150%] font-medium mq450:text-xs">
                {product?.watchDetails?.bandMaterial?.en}
              </div>
            </div>
            <div className="self-stretch flex flex-row items-center justify-between gap-0">
              <div className="relative leading-[150%] text-[18px] font-[500] font-medium mq450:text-xs">
                Case Diameter:
              </div>
              <div className="relative text-[16px] font-[500] text-right leading-[150%] font-medium mq450:text-xs">
                {product?.watchDetails?.caseDiameter}
              </div>
            </div>
            <div className="self-stretch flex flex-row items-center justify-between gap-0 mq450:flex-wrap">
              <div className="relative leading-[150%] text-[18px] font-[500] font-medium mq450:text-xs">
                Case Material:
              </div>
              <div className="relative text-[16px] font-[500] text-right  leading-[150%] font-medium mq450:text-xs">
                {product?.watchDetails?.caseMaterial?.en}
              </div>
            </div>
            <div className="self-stretch flex flex-row items-center justify-between gap-0 mq450:flex-wrap">
              <div className="relative text-[18px] font-[500] leading-[150%] font-medium mq450:text-xs">
                Bezel Ring Material:
              </div>
              <div className="relative text-[16px] font-[500] text-right leading-[150%] font-medium mq450:text-xs">
                {product?.watchDetails?.bezel_ring_material?.en}
              </div>
            </div>
            <div className="self-stretch flex flex-row items-center justify-between gap-0 mq450:flex-wrap">
              <div className="relative text-[18px] font-[500] leading-[150%] font-medium mq450:text-xs">
                Water Resistance:
              </div>
              <div className="relative text-[16px] font-[500] text-right leading-[150%] font-medium mq450:text-xs">
                {product?.watchDetails?.waterResistant?.en}
              </div>
            </div>
          </div>
          <div className="h-[243px] w-px relative border-[rgba(0,0,0,0.08)] border-solid border-r-[1px] box-border mq750:w-full mq750:h-px" />
          <div className="flex-1 flex flex-col items-start justify-start gap-4 min-w-[244px]">
            <div className="self-stretch flex flex-row items-center justify-between gap-0 mq450:flex-wrap">
              <div className="relative text-[18px] font-[500] leading-[150%] font-medium mq450:text-xs">
                Display Type:
              </div>
              <div className="relative text-[16px] font-[500] text-right leading-[150%] font-medium mq450:text-xs">
                {product?.watchDetails?.displayType?.en}
              </div>
            </div>
            <div className="self-stretch flex flex-row items-center justify-between gap-0 mq450:flex-wrap">
              <div className="relative leading-[150%] text-[18px] font-[500] font-medium mq450:text-xs">Glass:</div>
              <div className="relative text-[16px] font-[500] text-right leading-[150%] font-medium mq450:text-xs">
                {product?.watchDetails?.glass?.en}
              </div>
            </div>
            <div className="self-stretch flex flex-row items-center justify-between gap-0 mq450:flex-wrap">
              <div className="relative text-[18px] font-[500] leading-[150%] font-medium mq450:text-xs">
                Movement:
              </div>
              <div className="relative text-[16px] font-[500] text-right leading-[150%] font-medium mq450:text-xs">
                {product?.watchDetails?.movement?.en}
              </div>
            </div>
            <div className="self-stretch flex flex-row items-center justify-between gap-0">
              <div className="relative text-[18px] font-[500] leading-[150%] font-medium mq450:text-xs">
                Target Group:
              </div>
              <div className="relative text-[16px] font-[500] text-right leading-[150%] font-medium mq450:text-xs">
                {product?.watchDetails?.gender}
              </div>
            </div>
            <div className="self-stretch flex flex-row items-center justify-between gap-0 mq450:flex-wrap">
              <div className="relative text-[18px] font-[500] leading-[150%] font-medium mq450:text-xs">
                Warranty:
              </div>
              <div className="relative text-[16px] font-[500] text-right leading-[150%] font-medium mq450:text-xs">
                {product?.watchDetails?.warranty?.en}
              </div>
            </div>
            <div className="self-stretch flex flex-row items-center justify-between gap-0 mq450:flex-wrap">
              <div className="relative text-[18px] font-[500] leading-[150%] font-medium mq450:text-xs">
                Watch Type:
              </div>
              <div className="relative text-[16px] font-[500] text-right leading-[150%] font-medium mq450:text-xs">
                {product?.watchDetails?.watchType?.en}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

Specification.propTypes = {
  className: PropTypes.string,
  product: PropTypes.object.isRequired,
};

export default Specification;