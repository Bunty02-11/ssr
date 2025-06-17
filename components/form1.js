import PropTypes from "prop-types";
import { useState } from "react";
import Swal from 'sweetalert2';

const Form1 = ({ className = "" }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://0vm9jauvgc.execute-api.us-east-1.amazonaws.com/stag/api/contact/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      await response.json();

      // Show success alert
      Swal.fire({
        title: 'Success!',
        text: 'Your message has been sent successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#000',
        background: '#fff',
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      // Show error alert
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to send message. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#000',
        background: '#fff',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className={`self-stretch bg-[#000] overflow-hidden flex flex-col items-start justify-start py-[60px] px-10 box-border max-w-full z-[3] text-left text-21xl text-[#fff] font-h5-24 mq1050:pt-[39px] mq1050:pb-[39px] mq1050:box-border ${className}`}
    >
      <div className="self-stretch flex flex-row items-start justify-center gap-[60px] max-w-full mq750:gap-[30px] mq1125:flex-wrap">
        <h1 className="m-0 w-[495px] relative text-inherit leading-[120%] font-medium font-[inherit] inline-block shrink-0 max-w-full mq750:text-13xl mq750:leading-[38px] mq1050:text-5xl mq1050:leading-[29px]">
          We Are Here To Help
        </h1>
        <form
          onSubmit={handleSubmit}
          className="w-[805px] flex flex-col items-start justify-start gap-4 max-w-full text-sm mq450:min-w-full mq1125:flex-1"
        >
          <div className="self-stretch flex flex-row items-start justify-start gap-4 mq750:flex-wrap">
            <div className="flex-1 rounded-lg border-[rgba(255,255,255,0.24)] border-solid border-[1px] box-border flex flex-row items-center justify-start p-3 min-w-[257px]">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="flex-1 relative leading-[150%] font-medium bg-transparent border-none outline-none text-[#fff] placeholder-[rgba(255,255,255,0.7)]"
              />
            </div>
            <div className="flex-1 rounded-lg border-[rgba(255,255,255,0.24)] border-solid border-[1px] box-border flex flex-row items-center justify-start p-3 min-w-[257px]">
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="flex-1 relative leading-[150%] font-medium bg-transparent border-none outline-none text-[#fff] placeholder-[rgba(255,255,255,0.7)]"
              />
            </div>
          </div>
          <div className="self-stretch flex flex-row items-start justify-start gap-4 mq750:flex-wrap">
            <div className="flex-1 rounded-lg border-[rgba(255,255,255,0.24)] border-solid border-[1px] box-border flex flex-row items-center justify-start p-3 min-w-[257px]">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="flex-1 relative leading-[150%] font-medium bg-transparent border-none outline-none text-[#fff] placeholder-[rgba(255,255,255,0.7)]"
              />
            </div>
            <div className="flex-1 rounded-lg border-[rgba(255,255,255,0.24)] border-solid border-[1px] box-border flex flex-row items-center justify-start p-3 min-w-[257px]">
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="flex-1 relative leading-[150%] font-medium bg-transparent border-none outline-none text-[#fff] placeholder-[rgba(255,255,255,0.7)]"
              />
            </div>
          </div>
          <div className="self-stretch h-[102px] rounded-lg border-[rgba(255,255,255,0.24)] border-solid border-[1px] box-border flex flex-row items-start justify-start py-3 px-[11px]">
            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              required
              className="flex-1 relative leading-[150%] font-medium bg-transparent border-none outline-none text-[#fff] placeholder-[rgba(255,255,255,0.7)] resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-[100px] bg-[#fff] flex flex-row items-center justify-center py-3 px-6 text-center text-base text-[#000] cursor-pointer border-none disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <div className="relative leading-[150%] font-medium">
              {isSubmitting ? "Submitting..." : "Submit"}
            </div>
          </button>
        </form>
      </div>
    </section>
  );
};
Form1.propTypes = {
  className: PropTypes.string,
};

export default Form1;