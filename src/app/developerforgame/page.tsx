"use client";

import { useState } from "react";

import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@onelabs/dapp-kit";
import {
  createSubmitGameTransaction,
  uploadMetadataToIPFS,
  getContractConfig,
  isContractConfigured,
} from "@/lib/gameRegistry";
import Toast, { ToastType } from "@/components/Toast";
import SuccessModal from "@/components/SuccessModal";

export default function RegisterGamePage() {
  const router = useRouter();
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction();

  const [video, setVideo] = useState<File | null>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
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
    gameName: string;
  }>({
    isOpen: false,
    transactionHash: "",
    gameName: "",
  });

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const handleSuccessModalClose = () => {
    setSuccessModal({ isOpen: false, transactionHash: "", gameName: "" });
    // Add a small delay to allow blockchain state to propagate
    setTimeout(() => {
      router.push("/discovery");
    }, 1000);
  };

  // Form fields
  const [formData, setFormData] = useState({
    gameName: "",
    genre: "",
    description: "",
    platforms: [] as string[],
    releaseDate: "",
    websiteUrl: "",
  });

  const contractConfig = getContractConfig();
  const isConfigured = isContractConfigured();

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setVideo(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
  };
  const isImage = (file: File) => {
    return file.type.startsWith("image/");
  };

  const isSecondImage = (file: File) => {
    return file.type.startsWith("image/");
  };
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setLogo(file);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlatformChange = (platform: string) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const uploadToPinata = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      throw error;
    }
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
      showToast(
        "Smart contract not configured. Please deploy the contract first.",
        "error"
      );
      return;
    }

    if (files.length === 0 || !video) {
      showToast("Please upload both logo and game asset", "warning");
      return;
    }

    if (
      !formData.gameName ||
      !formData.genre ||
      !formData.description ||
      !formData.websiteUrl
    ) {
      showToast("Please fill in all required fields", "warning");
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      // Step 1: Upload logo to Pinata (using first file from game asset)
      setCurrentStep("Uploading game asset to IPFS...");
      setUploadProgress(15);
      const logoUrl = await uploadToPinata(files[0]);

      // Step 2: Upload video to Pinata (game logo)
      setCurrentStep("Uploading game logo to IPFS...");
      setUploadProgress(30);
      const videoUrl = await uploadToPinata(video);

      // Step 3: Upload metadata JSON to IPFS
      setCurrentStep("Uploading metadata to IPFS...");
      setUploadProgress(45);
      const metadata = {
        name: formData.gameName,
        description: formData.description,
        genre: formData.genre,
        platforms: formData.platforms,
        releaseDate: formData.releaseDate,
        websiteUrl: formData.websiteUrl,
        logoUrl,
        videoUrl,
        status: "Open",
        xp: "1500 XP",
        button: "Join Test",
        createdAt: new Date().toISOString(),
      };
      const ipfsHash = await uploadMetadataToIPFS(metadata);

      // Step 4: Submit transaction to blockchain
      setCurrentStep("Processing payment (0.1 OCT)...");
      setUploadProgress(60);

      const tx = createSubmitGameTransaction(ipfsHash, formData.gameName);

      const result = await signAndExecuteTransaction({
        transaction: tx,
      });

      setCurrentStep("Confirming transaction...");
      setUploadProgress(80);

      console.log("Full transaction result:", JSON.stringify(result, null, 2));
      console.log("Result keys:", Object.keys(result));
      console.log("Effects type:", typeof result.effects);
      console.log("Effects:", result.effects);

      // Transaction succeeded if we have a digest - OneChain returns effects as base64 string
      if (!result.digest) {
        console.error("Transaction failed - no digest");
        throw new Error("Transaction failed: No transaction digest");
      }

      console.log("Transaction succeeded! Digest:", result.digest);

      // Save to localStorage temporarily (until CORS issue is resolved)
      const gameData = {
        ...metadata,
        txDigest: result.digest,
        slug: formData.gameName.toLowerCase().replace(/\s+/g, "-"),
        title: formData.gameName,
        image: logoUrl,
      };
      const existingGames = JSON.parse(
        localStorage.getItem("submittedGames") || "[]"
      );
      existingGames.push(gameData);
      localStorage.setItem("submittedGames", JSON.stringify(existingGames));

      setUploadProgress(100);
      setCurrentStep("Game registered successfully!");

      setTimeout(() => {
        setSuccessModal({
          isOpen: true,
          transactionHash: result.digest,
          gameName: formData.gameName,
        });
      }, 1000);
    } catch (error: any) {
      console.error("Error submitting game:", error);

      let errorMsg = "Failed to register game";

      if (error?.message) {
        errorMsg = error.message;
      } else if (error?.toString) {
        errorMsg = error.toString();
      }

      // Provide more helpful error messages
      if (errorMsg.includes("Insufficient")) {
        errorMsg =
          "Insufficient OCT balance. Please ensure you have at least 0.1 OCT plus gas fees.";
      } else if (errorMsg.includes("User rejected")) {
        errorMsg = "Transaction cancelled by user.";
      }

      showToast(
        errorMsg + "\n\nPlease check the browser console for more details.",
        "error"
      );
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
        gameName={successModal.gameName}
      />
      <section className="min-h-screen bg-black text-white px-6 md:px-20 py-16 pt-32">
        <div className="mb-6">
          <h1 className="font-fancy text-4xl mb-2">Register Your Game</h1>
          <div className="flex items-center gap-4">
            <p className="text-gray-400">
              Submit your game to our platform. Fee:{" "}
              {contractConfig.gameFeeInOCT} OCT
            </p>
            {currentAccount && (
              <p className="text-sm text-green-500">✓ Wallet Connected</p>
            )}
            {!isConfigured && (
              <p className="text-sm text-yellow-500">⚠ Contract not deployed</p>
            )}
          </div>
        </div>

        {!currentAccount && (
          <div className="bg-yellow-900/30 border border-yellow-600 rounded-md p-4 mb-6">
            <p className="text-yellow-400 text-sm">
              Please connect your OneChain wallet to submit a game.
            </p>
          </div>
        )}

        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Name + Genre */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm">Game Name *</label>
              <input
                type="text"
                name="gameName"
                placeholder="Game Clash"
                value={formData.gameName}
                onChange={handleInputChange}
                required
                className="w-full rounded-md bg-zinc-900 border border-zinc-700 px-4 py-3 outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm">Genre *</label>
              <input
                type="text"
                name="genre"
                placeholder="Combat"
                value={formData.genre}
                onChange={handleInputChange}
                required
                className="w-full rounded-md bg-zinc-900 border border-zinc-700 px-4 py-3 outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 text-sm">Description *</label>
            <textarea
              name="description"
              rows={5}
              placeholder="Tell us about your game..."
              value={formData.description}
              onChange={handleInputChange}
              required
              className="w-full rounded-md bg-zinc-900 border border-zinc-700 px-4 py-3 outline-none"
            ></textarea>
          </div>

          {/* Website URL */}
          <div>
            <label className="block mb-2 text-sm">Website/Game URL *</label>
            <input
              type="url"
              name="websiteUrl"
              placeholder="https://yourgame.com"
              value={formData.websiteUrl}
              onChange={handleInputChange}
              required
              className="w-full rounded-md bg-zinc-900 border border-zinc-700 px-4 py-3 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              This URL will be used when players click &quot;Join Test&quot;
            </p>
          </div>

          {/* Platform + Release date */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm">Platform</label>
              <div className="space-y-2">
                {["Pc", "Mobile", "Mac", "Linux"].map((platform) => (
                  <label key={platform} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.platforms.includes(platform)}
                      onChange={() => handlePlatformChange(platform)}
                      className="accent-indigo-600"
                    />
                    <span>{platform}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm">Release date</label>
              <input
                type="date"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleInputChange}
                className="w-full rounded-md bg-zinc-900 border border-zinc-700 px-4 py-3 outline-none"
              />
            </div>
          </div>

          {/* Game asset upload */}
          <div>
            <label className="block mb-2 text-sm">Game asset</label>
            {files.length > 0 ? (
              <div className="space-y-3">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    {isImage(file) ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-20 h-20 flex items-center justify-center bg-zinc-800 rounded-md text-gray-400 text-xs">
                        {file.type || "FILE"}
                      </div>
                    )}
                    <button
                      type="button"
                      className="text-red-500 text-sm"
                      onClick={() =>
                        setFiles((prev) => prev.filter((_, i) => i !== index))
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-zinc-700 rounded-md cursor-pointer hover:border-indigo-500 transition">
                <FontAwesomeIcon icon={faCloudArrowUp} />
                <p className="text-gray-400 text-sm">
                  Drag and drop your files here or{" "}
                  <span className="text-indigo-500">browse</span>
                </p>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  multiple
                />
              </label>
            )}
          </div>

          {/* Project logo upload */}
          <div>
            <label className="block mb-2 text-sm">Game Logo</label>
            {video ? (
              <div className="flex items-center justify-between">
                {/* Image Preview if image */}
                {isSecondImage(video) ? (
                  <img
                    src={URL.createObjectURL(video)}
                    alt={video.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-20 h-20 flex items-center justify-center bg-zinc-800 rounded-md text-gray-400 text-xs">
                    {video.type || "FILE"}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setVideo(null)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-zinc-700 rounded-md cursor-pointer hover:border-indigo-500 transition">
                <FontAwesomeIcon icon={faCloudArrowUp} />
                <p className="text-gray-400 text-sm">
                  Drag and drop your file here or{" "}
                  <span className="text-indigo-500">browse</span>
                </p>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleVideoChange}
                />
              </label>
            )}
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="bg-zinc-900 p-4 rounded-md border border-indigo-600">
              <div className="flex justify-between mb-2">
                <span className="text-sm">
                  {currentStep || "Processing..."}
                </span>
                <span className="text-sm">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-zinc-700 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all"
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

          {/* Buttons */}
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
              className="px-6 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading
                ? "Processing..."
                : !currentAccount
                ? "Connect Wallet to Submit"
                : !isConfigured
                ? "Contract Not Deployed"
                : `Submit (Pay ${contractConfig.gameFeeInOCT} OCT)`}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
