import bronze from "../../assets/images/bronze.png";
import silver from "../../assets/images/silver.png";
import gold from "../../assets/images/gold.png";
import dimond from "../../assets/images/dimond.png";
import vip from "../../assets/images/vip.png";
import legend from "../../assets/images/legend.png";
import useStatusPaymentStore from "../../store/statusPayment";
import CustomInput from "../ui/CustomInput";
import CustomButton from "../ui/CustomButton";
import { useState } from "react";
import { FaRegCopy, FaPaperclip } from "react-icons/fa6";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import useAuthStore from "../../store/authStore";

const imgs = {
  Bronze: bronze,
  Silver: silver,
  Gold: gold,
  Diamond: dimond,
  Vip: vip,
  LEGENDA: legend,
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const StatusPayment = () => {
  const { obj, setOpen, setPaymentStatusOpen, setPaymentStatus } =
    useStatusPaymentStore((state) => state);
  const user = useAuthStore((s) => s.user);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  console.log(obj);

  // React Query mutation
  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/payments`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      setFile(null);
      setOpen(false);
      setPaymentStatus("success");
      setPaymentStatusOpen(true);
    },
    onError: (err: any) => {
      setOpen(false);
      setPaymentStatus(String(err.status ?? "error"));
      setPaymentStatusOpen(true);
    },
  });

  const validateFile = (f: File | null) => {
    if (!f) return "Receipt is required";
    if (!f.type.startsWith("image/")) return "File must be an image";
    if (f.size > MAX_FILE_SIZE) return "Image must be smaller than 5 MB";
    return null;
  };

  const handleFileChange = (f: File | null) => {
    setFile(f);
    setFileError(null);
  };

  const runAllValidations = () => {
    const fe = validateFile(file);

    setFileError(fe);

    return !fe;
  };

  const handleSubmit = () => {
    // final validation
    const ok = runAllValidations();
    if (!ok) {
      return;
    }
    const formData = new FormData();
    formData.append("userId", String(user?.id));
    formData.append("sum", String(obj.sum));
    formData.append("context", "Status");
    formData.append("contextStatus", obj.title);
    if (file) formData.append("receipt", file);
    mutation.mutate(formData);
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <img
        src={imgs[obj.title as keyof typeof imgs]}
        alt={obj.title}
        className='w-full h-[90px] object-contain'
      />
      <p className='text-white font-semibold text-2xl'>{obj.title}</p>
      <p className='text-white text-[13px] pb-5'>{obj.text}</p>

      <div className='w-full flex flex-col gap-5'>
        <div className='w-full flex items-center gap-2'>
          <div className='flex-1'>
            <CustomInput
              onChange={() => console.log(1)}
              readOnly={true}
              pl='9696 9559 9559 9595'
            />
          </div>
          <button
            type='button'
            className='bg-[linear-gradient(90deg,#9CFF8F_0%,#92FDB9_50.5%,#83FEE4_100%)] p-2 rounded-xl hover:scale-105 active:scale-105 transition-all outline-none'
            onClick={() => {
              // copy raw digits to clipboard formatted or raw
              const toCopy = "9696 9559 9559 9595";
              navigator.clipboard?.writeText(toCopy).then(
                () => {
                  console.log(toCopy);
                },
                () => {}
              );
            }}>
            <FaRegCopy className='text-[25px]' />
          </button>
        </div>

        <div>
          <CustomInput
            readOnly={true}
            onChange={() => {
              console.log(1);
            }}
            pl='Ergashev Islom'
          />
        </div>

        {/* Upload file */}
        <div className='w-full flex items-center justify-between'>
          <div>
            <p className='text-white text-[15px]'>
              To’lagandan so'ng, chekni ilova qiling
            </p>
            {file && (
              <p className='text-sm text-white/70 mt-1'>
                {file.name} ({Math.round(file.size / 1024)} KB)
              </p>
            )}
            {fileError && (
              <p className='text-red-400 text-sm mt-1'>{fileError}</p>
            )}
          </div>

          <label className='bg-[linear-gradient(90deg,#9CFF8F_0%,#92FDB9_50.5%,#83FEE4_100%)] p-2 rounded-xl hover:scale-105 active:scale-105 transition-all outline-none cursor-pointer'>
            <FaPaperclip className='text-[25px]' />
            <input
              type='file'
              accept='image/*'
              className='hidden'
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                // validate file immediately
                const fe = validateFile(f);
                if (fe) {
                  setFile(null);
                  setFileError(fe);
                } else {
                  handleFileChange(f);
                }
              }}
            />
          </label>
        </div>

        <CustomButton
          title={"Yuborish"}
          className='w-full text-[14px] font-medium'
          onClick={handleSubmit}
          disabled={Boolean(fileError) || !file}
        />
      </div>
    </div>
  );
};

export default StatusPayment;
