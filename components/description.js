"use client";
import { useMemo } from "react";
import Image from "next/image";
import PropTypes from "prop-types";
import AnimateOnScroll from "./AnimateOnScroll";
import { motion } from "framer-motion";

const Description = ({
  className = "",
  descriptionAlignSelf,
  descriptionWidth,
  textMinWidth,
  description,
  img,
  product,
}) => {
  const descriptionStyle = useMemo(() => {
    return {
      alignSelf: descriptionAlignSelf,
      width: descriptionWidth,
    };
  }, [descriptionAlignSelf, descriptionWidth]);

  const textStyle = useMemo(() => {
    return {
      minWidth: textMinWidth,
    };
  }, [textMinWidth]);

  return (
    <div className="flex flex-col gap-16">
      <section
        className={`self-stretch overflow-hidden flex flex-row mx-auto px-5 sm:px-6 md:px-8 lg:px-5 items-center justify-center box-border gap-[60px] max-w-[1360px] text-37xl text-[#000] font-h5-24 mq750:gap-[30px] mq750:pt-[26px] mq750:pb-[26px] mq750:box-border mq1125:flex-wrap ${className}`}
        style={descriptionStyle}
      >
        <AnimateOnScroll
          animation="slideRight"
          className="flex-1 flex flex-col items-center justify-start gap-6 min-w-[520px] pt-0 mq750:min-w-full"
          style={textStyle}
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="m-0 self-stretch relative text-black text-inherit leading-[120%] font-bold font-[inherit] mq450:text-[34px] mq450:leading-[40px] mq1050:text-[45px] mq1050:leading-[54px]"
          >
            {description}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="self-stretch relative text-black text-base mq450:text-sm leading-[150%] font-medium"
          >
            {product?.description?.en}
          </motion.div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="slideLeft">
          <Image
            className="h-[500px] w-[500px] rounded-3xl object-cover max-w-full mq1125:flex-1 mq450:w-[400px] mq450:h-[300px]"
            loading="lazy"
            width={500}
            height={500}
            alt=""
            src={img}
          />
        </AnimateOnScroll>
      </section>

      {/* Specifications Section */}
      {product?.specifications && (
        <section className="self-stretch flex flex-row mr-[-5px] items-start justify-center box-border gap-[60px] max-w-[1360px] mq750:gap-[30px] mq750:pt-[26px] mq750:pb-[26px] mq750:box-border">
          <AnimateOnScroll
            animation="slideUp"
            className="flex-1 flex flex-col gap-6 min-w-[520px] pt-0 mq750:min-w-full"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold mb-6"
            >
              Specifications
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(product.specifications).map(([key, value]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col gap-2"
                >
                  <span className="text-gray-600 font-medium">{key}</span>
                  <span className="text-black">{value}</span>
                </motion.div>
              ))}
            </div>
          </AnimateOnScroll>
        </section>
      )}

      {/* Video Section */}
      {product?.videoUrl && (
        <section className="self-stretch flex flex-row mr-[-5px] items-center justify-center box-border gap-[60px] max-w-[1360px] mq750:gap-[30px] mq750:pt-[26px] mq750:pb-[26px] mq750:box-border">
          <AnimateOnScroll
            animation="slideUp"
            className="flex-1 flex flex-col gap-6 min-w-[520px] pt-0 mq750:min-w-full"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold mb-6"
            >
              Product Video
            </motion.h2>
            <div className="aspect-video w-full rounded-2xl overflow-hidden">
              <iframe
                src={product.videoUrl}
                className="w-full h-full"
                allowFullScreen
                title="Product Video"
              />
            </div>
          </AnimateOnScroll>
        </section>
      )}
    </div>
  );
};

Description.propTypes = {
  className: PropTypes.string,
  descriptionAlignSelf: PropTypes.string,
  descriptionWidth: PropTypes.string,
  textMinWidth: PropTypes.string,
  description: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  product: PropTypes.shape({
    description: PropTypes.shape({
      en: PropTypes.string,
    }),
    specifications: PropTypes.object,
    videoUrl: PropTypes.string,
  }),
};

export default Description;
