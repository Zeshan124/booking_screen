import Image from "next/image";
import Form from "./_components/Form";

import { cookies } from "next/headers";
import { sendOTP } from "./_lib/actions";
import Success from "./_components/Success";
import { decryptOrderID, hidePhoneNumber } from "./_lib/utils";

export const metadata = {
  title: "Qistbazaar",
  description: "Qistbazaar is BNPL",
};

export default async function Page({ params }) {

  const orderID = decryptOrderID(params?.orderID);
  console.log("orderID", orderID);

  const cookieStore = cookies();

  const submittedAlready = cookieStore.get("submitted");
  if(parseInt(submittedAlready?.value) === parseInt(orderID)){
    return <Success/>
  }
  


  let errorMessage = "";
  let existingCustomerNumber = "";
  let existingEncryptedData = "";
  let otpExpiry;
  let save=false;;

  existingCustomerNumber = cookieStore.get("customerNumber")?.value;
  existingEncryptedData = cookieStore.get("encryptedData")?.value;
  otpExpiry = cookieStore.get("otpExpiry")?.value;

  try {
    if (!existingCustomerNumber || !existingEncryptedData ||  !otpExpiry) {
      const response = await sendOTP(orderID);
      if(response?.error){
        throw new Error(response?.error);
      }
      console.log(response, "requestOTP");
      otpExpiry = Math.floor(Date.now() / 1000) + 120; 
      existingCustomerNumber = response?.customerNumber;
      existingEncryptedData = response?.encryptedData;
      save=true
    }
  } catch (error) {
    console.error(error);
    errorMessage = error?.message || "Error Fetching OTP! Refresh";
  }

  return (
    <div className="container flex justify-center items-center flex-col">
      <div className="relative mx-auto pt-10 pb-5">
        <Image
          width={220}
          height={55}
          src="/qistBazaar.png" // Ensure the file is in the 'public' folder
          alt="Qistbazaar Logo"
          className="object-contain"
        />
      </div>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {!errorMessage && (
        <div className="flex justify-center items-center flex-col">
          <h1 className="text-center tracking-[-0.75px] max-w-[700px] mb-2.5 text-2xl md:text-4xl font-bold leading-[46px]">
            Check your Phone for a code
          </h1>
          <p className="text-[#454245] text-center max-w-[700px] mb-8 text-sm md:text-base leading-[20px]">
            We’ve sent a 6-digit code to{" "}
            <strong>+{hidePhoneNumber(existingCustomerNumber)}</strong>. The
            code expires shortly,
            <span className="md:block"> so please enter it soon.</span>
          </p>
          <Form
            otpExpiry={otpExpiry}
            encryptedData={existingEncryptedData}
            customerNumber={existingCustomerNumber}
            orderID={orderID}
            save={save}
          />
        </div>
      )}
    </div>
  );
}
