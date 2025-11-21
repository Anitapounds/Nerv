"use client";

import { useState } from "react";

export default function DeveloperSupportPage() {
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    stage: "",
    releaseDate: "",
    supportTypes: [] as string[],
    raisedMoney: "",
    assistance: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSupportTypeToggle = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      supportTypes: prev.supportTypes.includes(type)
        ? prev.supportTypes.filter((t) => t !== type)
        : [...prev.supportTypes, type],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Form submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-12 py-16 pt-32">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl mb-2 font-fancy">
          Developer Support Hub
        </h1>
        <p className="text-gray-400 mb-10">
          Get the support you need to build, launch, and scale the next Web3 game. <br />
          Submit your project below and get reviewed by our team.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Project name */}
          <div>
            <label className="block text-sm mb-2">Project name</label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              placeholder="Enter the name of your game or dApp"
              className="w-full px-4 py-3 rounded-md bg-neutral-900 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm mb-2">Game / dApp Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Tell us about your project. What makes it unique?"
              className="w-full px-4 py-3 rounded-md bg-neutral-900 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Development stage */}
          <div>
            <label className="block text-sm mb-3">Current development stage</label>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                {["Concept", "Prototype", "Alpha", "Beta", "Launched"].map(
                  (stage) => (
                    <label key={stage} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="stage"
                        value={stage}
                        checked={formData.stage === stage}
                        onChange={handleChange}
                        className="accent-blue-500"
                      />
                      {stage}
                    </label>
                  )
                )}
              </div>

              <div>
                <label className="block text-sm mb-2">Release date (Optional)</label>
                <input
                  type="date"
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-md bg-neutral-900 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Type of support */}
          <div>
            <label className="block text-sm mb-3">Type of support needed</label>
            <div className="flex flex-wrap gap-4">
              {["Funding", "Playtesting", "Marketing", "Technical advice", "Community building"].map(
                (type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => handleSupportTypeToggle(type)}
                    className={`px-4 py-2 rounded-full border ${
                      formData.supportTypes.includes(type)
                        ? "border-blue-500 text-blue-400"
                        : "border-neutral-700 text-gray-400 hover:border-gray-500"
                    } transition`}
                  >
                    {type}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Raised Money */}
          <div>
            <label className="block text-sm mb-3">Previously raised money?</label>
            <div className="flex gap-6">
              {["Yes", "No"].map((option) => (
                <label
                  key={option}
                  className={`px-6 py-2 rounded-md border text-center cursor-pointer ${
                    formData.raisedMoney === option
                      ? "border-blue-500 text-blue-400"
                      : "border-neutral-700 text-gray-400 hover:border-gray-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="raisedMoney"
                    value={option}
                    checked={formData.raisedMoney === option}
                    onChange={handleChange}
                    className="hidden"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          {/* Assistance */}
          <div>
            <label className="block text-sm mb-2">Specific Assistance needed</label>
            <textarea
              name="assistance"
              value={formData.assistance}
              onChange={handleChange}
              rows={4}
              placeholder="Describe any challenges or areas where you need help to scale your project"
              className="w-full px-4 py-3 rounded-md bg-neutral-900 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="px-8 py-3 rounded-md bg-gray-700 hover:bg-gray-600 transition text-white"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
