import PropTypes from "prop-types";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

const Form = ({ className = "" }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // The API expects "message" instead of "comment"
      const payload = {
        name: formData.name,
        email: formData.email,
        message: formData.comment
      };
      const res = await fetch("https://0vm9jauvgc.execute-api.us-east-1.amazonaws.com/stag/api/notify/blog-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error("Failed to submit comment. Please try again.");
      }
      toast.success("Comment submitted successfully!");
      setFormData({ name: "", email: "", comment: "" });
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <section
        className={`self-stretch bg-[#000] overflow-hidden flex flex-col items-start justify-start py-[60px] px-10 box-border max-w-full text-left text-21xl text-[#fff] font-h5-24 mq1050:pt-[39px] mq1050:pb-[39px] mq1050:box-border ${className}`}
      >
        <form onSubmit={handleSubmit} className="self-stretch">
          <div className="self-stretch flex flex-row items-start justify-center gap-[60px] max-w-full mq750:gap-[30px] mq1125:flex-wrap">
            <h1 className="m-0 w-[495px] relative text-inherit leading-[120%] font-medium font-[inherit] inline-block shrink-0 max-w-full mq750:text-13xl mq750:leading-[38px] mq1050:text-5xl mq1050:leading-[29px]">
              Post Your Comment!
            </h1>
            <div className="self-stretch w-[805px] flex flex-col items-start justify-start gap-4 max-w-full text-sm mq450:min-w-full mq1125:flex-1">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="self-stretch rounded-lg border-[rgba(255,255,255,0.24)] border-solid border-[1px] flex flex-row items-center justify-start py-3 px-[11px] bg-transparent text-white placeholder-[rgba(255,255,255,0.7)] focus:outline-none"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="self-stretch rounded-lg border-[rgba(255,255,255,0.24)] border-solid border-[1px] flex flex-row items-center justify-start py-3 px-[11px] bg-transparent text-white placeholder-[rgba(255,255,255,0.7)] focus:outline-none"
                required
              />
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                placeholder="Comment"
                className="self-stretch h-[102px] rounded-lg border-[rgba(255,255,255,0.24)] border-solid border-[1px] box-border flex flex-row items-start justify-start py-3 px-[11px] bg-transparent text-white placeholder-[rgba(255,255,255,0.7)] focus:outline-none resize-none"
                required
              />
              <button
                type="submit"
                className="rounded-[100px] bg-[#fff] flex flex-row items-center justify-center py-3 px-6 text-center text-base text-[#000] hover:bg-[#f0f0f0] transition-colors duration-200 cursor-pointer"
                disabled={loading}
              >
                <div className="relative leading-[150%] font-medium">
                  {loading ? "Posting..." : "Post Comment"}
                </div>
              </button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

Form.propTypes = {
  className: PropTypes.string,
};

export default Form;