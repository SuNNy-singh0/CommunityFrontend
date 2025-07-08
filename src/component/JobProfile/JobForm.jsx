import { useState } from "react";
import axios from "axios";
import "./JobForm.css";

const JobForm = () => {
  const [formData, setFormData] = useState({
    description: "",
    communitytype: "",
    tag: [],
    file: null,
    sourcelink: "", // New field for source link
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      file: file,
    }));

    // Create preview URL
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  // Handle tags input
  const handleTagsChange = (e) => {
    const tags = e.target.value.split(",").map((tag) => tag.trim());
    setFormData((prev) => ({
      ...prev,
      tag: tags,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("description", formData.description);
      formDataToSend.append("communitytype", formData.communitytype);
      formDataToSend.append("sourcelink", formData.sourcelink); // Include source link

      // Ensure tags are properly sent as separate entries
      if (formData.tag.length > 0) {
        formData.tag.forEach((tag) => {
          formDataToSend.append("tag", tag.trim());
        });
      }

      // Only append file if it exists
      if (formData.file) {
        formDataToSend.append("file", formData.file);
      }
     console.log(formData);
      const response = await axios.post(
        "http://13.201.100.143:8080/jobs/create",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      setSuccess("Job posted successfully!");
      // Reset form
      setFormData({
        description: "",
        communitytype: "",
        tag: [],
        file: null,
        sourcelink: "",
      });
      setPreview(null);
    } catch (err) {
      setError(err.response?.data || "Error posting job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="jobform-container">
      <h2 className="jobform-title">Create New Job Post</h2>

      {error && <div className="jobform-alert jobform-alert-error">{error}</div>}
      {success && <div className="jobform-alert jobform-alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="jobform-form">
        {/* Job Description */}
        <div className="jobform-field">
          <label className="jobform-label">Job Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="jobform-textarea"
          />
        </div>

        {/* Community Type */}
        <div className="jobform-field">
          <label className="jobform-label">Community Type</label>
          <select
            name="communitytype"
            value={formData.communitytype}
            onChange={handleChange}
            required
            className="jobform-select"
          >
            <option value="">Select Community</option>
            <option value="MERN">MERN</option>
            <option value="DSA">DSA</option>
            <option value="Java">Java</option>
            <option value="other">other</option>
          </select>
        </div>

        {/* Tags */}
        <div className="jobform-field">
          <label className="jobform-label">Tags (comma-separated)</label>
          <input
            type="text"
            value={formData.tag.join(", ")}
            onChange={handleTagsChange}
            placeholder="e.g. React, JavaScript, Frontend"
            className="jobform-input"
          />
        </div>

        {/* Source Link (New Field) */}
        <div className="jobform-field">
          <label className="jobform-label">Source Link</label>
          <input
            type="url"
            name="sourcelink"
            value={formData.sourcelink}
            onChange={handleChange}
            placeholder="https://example.com/job-details"
            className="jobform-input"
          />
        </div>

        {/* Image Upload */}
        <div className="jobform-field">
          <label className="jobform-label">Image (Optional)</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="jobform-file-input"
          />
          {preview && (
            <div className="jobform-preview">
              <img src={preview} alt="Preview" />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`jobform-button ${loading ? "jobform-button-disabled" : ""}`}
        >
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
};

export default JobForm;
