"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@onelabs/dapp-kit";
import { createSubmitProjectTransaction, uploadMetadataToIPFS, getContractConfig, isContractConfigured } from "@/lib/gameRegistry";
import Toast, { ToastType } from "@/components/Toast";
import SuccessModal from "@/components/SuccessModal";

export default function DeveloperSupportPage() {
  const router = useRouter();
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    stage: "",
    releaseDate: "",
    supportTypes: [] as string[],
    raisedMoney: "",
    assistance: "",
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string>("");

  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    isVisible: boolean;
  }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  // Success Modal state
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    transactionHash: string;
    projectName: string;
  }>({
    isOpen: false,
    transactionHash: "",
    projectName: "",
  });

  const contractConfig = getContractConfig();
  const isConfigured = isContractConfigured();

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const handleSuccessModalClose = () => {
    setSuccessModal({ isOpen: false, transactionHash: "", projectName: "" });
    router.push("/discovery");
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check wallet connection
    if (!currentAccount) {
      showToast("Please connect your wallet first", "warning");
      return;
    }

    // Check contract configuration
    if (!isConfigured) {
      showToast("Smart contract not configured. Please deploy the contract first.", "error");
      return;
    }

    if (!formData.projectName || !formData.description || !formData.stage) {
      showToast("Please fill in all required fields", "warning");
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      // Step 1: Upload metadata JSON to IPFS
      setCurrentStep("Uploading project details to IPFS...");
      setUploadProgress(30);

      const metadata = {
        projectName: formData.projectName,
        description: formData.description,
        stage: formData.stage,
        releaseDate: formData.releaseDate,
        supportTypes: formData.supportTypes,
        raisedMoney: formData.raisedMoney,
        assistance: formData.assistance,
        submittedAt: new Date().toISOString(),
      };

      const ipfsHash = await uploadMetadataToIPFS(metadata);

      // Step 2: Submit transaction to blockchain
      setCurrentStep("Processing payment (0.05 OCT)...");
      setUploadProgress(60);

      const tx = createSubmitProjectTransaction(ipfsHash, formData.projectName);

      const result = await signAndExecuteTransaction({
        transaction: tx,
      });

      setCurrentStep("Confirming transaction...");
      setUploadProgress(80);

      console.log("Full transaction result:", JSON.stringify(result, null, 2));

      // Transaction succeeded if we have a digest
      if (!result.digest) {
        console.error("Transaction failed - no digest");
        throw new Error("Transaction failed: No transaction digest");
      }

      console.log("Transaction succeeded! Digest:", result.digest);

      setUploadProgress(100);
      setCurrentStep("Project submitted successfully!");

      setTimeout(() => {
        setSuccessModal({
          isOpen: true,
          transactionHash: result.digest,
          projectName: formData.projectName,
        });
      }, 1000);
    } catch (error: any) {
      console.error("Error submitting project:", error);

      let errorMsg = "Failed to submit project";

      if (error?.message) {
        errorMsg = error.message;
      } else if (error?.toString) {
        errorMsg = error.toString();
      }

      // Provide more helpful error messages
      if (errorMsg.includes("Insufficient")) {
        errorMsg = "Insufficient OCT balance. Please ensure you have at least 0.05 OCT plus gas fees.";
      } else if (errorMsg.includes("User rejected")) {
        errorMsg = "Transaction cancelled by user.";
      }

      showToast(errorMsg + "\n\nPlease check the browser console for more details.", "error");
      setCurrentStep("");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={toast.type === "success" ? 8000 : 5000}
      />
      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={handleSuccessModalClose}
        transactionHash={successModal.transactionHash}
        gameName={successModal.projectName}
      />
      <div className="min-h-screen bg-black text-white px-6 md:px-12 py-16 pt-32">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <h1 className="text-4xl mb-2 font-fancy">
            Developer Support Hub
          </h1>
          <div className="flex items-center gap-4 mb-10">
            <p className="text-gray-400">
              Get the support you need to build, launch, and scale the next Web3 game. Fee: {contractConfig.projectFeeInOCT} OCT
            </p>
            {currentAccount && (
              <p className="text-sm text-green-500">✓ Wallet Connected</p>
            )}
            {!isConfigured && (
              <p className="text-sm text-yellow-500">⚠ Contract not deployed</p>
            )}
          </div>

          {!currentAccount && (
            <div className="bg-yellow-900/30 border border-yellow-600 rounded-md p-4 mb-6">
              <p className="text-yellow-400 text-sm">
                Please connect your OneChain wallet to submit your project.
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Project name */}
            <div>
              <label className="block text-sm mb-2">Project name *</label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                required
                placeholder="Enter the name of your game or dApp"
                className="w-full px-4 py-3 rounded-md bg-neutral-900 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm mb-2">Game / dApp Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Tell us about your project. What makes it unique?"
                className="w-full px-4 py-3 rounded-md bg-neutral-900 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Development stage */}
            <div>
              <label className="block text-sm mb-3">Current development stage *</label>
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
                          required
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

            {/* Upload Progress */}
            {isUploading && (
              <div className="bg-zinc-900 p-4 rounded-md border border-purple-600">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">{currentStep || "Processing..."}</span>
                  <span className="text-sm">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                {uploadProgress >= 60 && uploadProgress < 80 && (
                  <p className="text-xs text-gray-400 mt-2">
                    Please confirm the transaction in your wallet...
                  </p>
                )}
              </div>
            )}

            {/* Submit */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={isUploading}
                className="px-6 py-2 rounded-md bg-zinc-700 hover:bg-zinc-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading || !currentAccount || !isConfigured}
                className="px-8 py-3 rounded-md bg-gray-700 hover:bg-gray-600 transition text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading
                  ? "Processing..."
                  : !currentAccount
                  ? "Connect Wallet to Submit"
                  : !isConfigured
                  ? "Contract Not Deployed"
                  : `Submit (Pay ${contractConfig.projectFeeInOCT} OCT)`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
