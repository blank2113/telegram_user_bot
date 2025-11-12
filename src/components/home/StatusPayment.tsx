import bronze from "../../assets/images/bronze.png";
import silver from "../../assets/images/silver.png";
import gold from "../../assets/images/gold.png";
import dimond from "../../assets/images/dimond.png";
import vip from "../../assets/images/vip.png";
import legend from "../../assets/images/legend.png";
import useStatusPaymentStore from "../../store/statusPayment";
import CustomInput from "../ui/CustomInput";
import CustomButton from "../ui/CustomButton";
import { useState, useMemo } from "react";
import { FaRegCopy, FaPaperclip } from "react-icons/fa6";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const imgs = {
  Bronze: bronze,
  Silver: silver,
  Gold: gold,
  Diamond: dimond,
  Vip: vip,
  LEGENDA: legend,
};

/** Helpers */
const onlyDigits = (s: string) => s.replace(/\D/g, "");
const formatCardNumber = (digits: string) =>
  digits.replace(/(.{4})/g, "$1 ").trim(); // groups of 4

// Luhn algorithm
const luhnCheck = (digits: string) => {
  let sum = 0;
  let shouldDouble = false;
  // process from right to left
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10);
    if (shouldDouble) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

// Name validation: allow Latin, Cyrillic, spaces, hyphen, apostrophe. Min 2 chars.
const validNameRegex = /^[A-Za-zА-Яа-яЁё\u0400-\u04FF' -]{2,}$/;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const StatusPayment = () => {
  const { obj, setOpen, setPaymentStatusOpen, setPaymentStatus } =
    useStatusPaymentStore((state) => state);
  const [cardNum, setCardNum] = useState<string>(""); // raw digits only
  const [name, setName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const [cardError, setCardError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // React Query mutation
  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axios.post(
        "http://localhost:3000/api/payments",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      setCardNum("");
      setName("");
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

  // derived formatted value for input display
  const formattedCard = useMemo(() => formatCardNumber(cardNum), [cardNum]);

  // Validation functions
  const validateCard = (digits: string) => {
    if (!digits) return "Card number is required";
    if (digits.length !== 16) return "Card number must be 16 digits";
    if (!luhnCheck(digits)) return "Invalid card number";
    return null;
  };

  const validateName = (value: string) => {
    if (!value) return "Full name is required";
    if (!validNameRegex.test(value))
      return "Invalid name (only letters, spaces, - and ' allowed)";
    return null;
  };

  const validateFile = (f: File | null) => {
    if (!f) return "Receipt is required";
    if (!f.type.startsWith("image/")) return "File must be an image";
    if (f.size > MAX_FILE_SIZE) return "Image must be smaller than 5 MB";
    return null;
  };

  // Handlers
  const handleCardChange = (rawValue: string) => {
    // strip nondigits, limit to 16 digits
    const digits = onlyDigits(rawValue).slice(0, 16);
    setCardNum(digits);
    setCardError(null); // clear immediate error while typing
  };

  const handleNameChange = (value: string) => {
    setName(value);
    setNameError(null);
  };

  const handleFileChange = (f: File | null) => {
    setFile(f);
    setFileError(null);
  };

  const runAllValidations = () => {
    const ce = validateCard(cardNum);
    const ne = validateName(name.trim());
    const fe = validateFile(file);

    setCardError(ce);
    setNameError(ne);
    setFileError(fe);

    return !ce && !ne && !fe;
  };

  const handleSubmit = () => {
    // final validation
    const ok = runAllValidations();
    if (!ok) {
      return;
    }

    const formData = new FormData();
    formData.append("userId", "2");
    formData.append("sum", "10000");
    formData.append("cardNumber", cardNum);
    formData.append("fullName", name.trim());
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
              value={formattedCard}
              onChange={(e) => {
                // allow CustomInput to pass event or raw value
                const v =
                  (e?.target?.value as string) ?? (e as unknown as string);
                handleCardChange(v);
              }}
              pl='9696 9559 9559 9595'
            />
            {cardError && (
              <p className='text-red-400 text-sm mt-1'>{cardError}</p>
            )}
          </div>
          <button
            type='button'
            className='bg-[linear-gradient(90deg,#9CFF8F_0%,#92FDB9_50.5%,#83FEE4_100%)] p-2 rounded-[12px] hover:scale-105 active:scale-105 transition-all outline-none'
            onClick={() => {
              // copy raw digits to clipboard formatted or raw
              const toCopy = formattedCard;
              navigator.clipboard?.writeText(toCopy).then(
                () => {
                  // optionally give feedback
                },
                () => {}
              );
            }}>
            <FaRegCopy className='text-[25px]' />
          </button>
        </div>

        <div>
          <CustomInput
            value={name}
            onChange={(e) => {
              const v =
                (e?.target?.value as string) ?? (e as unknown as string);
              handleNameChange(v);
            }}
            pl='Ergashev Islom'
          />
          {nameError && (
            <p className='text-red-400 text-sm mt-1'>{nameError}</p>
          )}
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

          <label className='bg-[linear-gradient(90deg,#9CFF8F_0%,#92FDB9_50.5%,#83FEE4_100%)] p-2 rounded-[12px] hover:scale-105 active:scale-105 transition-all outline-none cursor-pointer'>
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
          disabled={
            Boolean(cardError) ||
            Boolean(nameError) ||
            Boolean(fileError) ||
            cardNum.length !== 16 ||
            !name ||
            !file
          }
        />
      </div>
    </div>
  );
};

export default StatusPayment;
