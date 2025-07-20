import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCreateCheckoutSessionMutation } from "@/features/api/purchaseApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

function BuyCourseButton({ courseId }) {
  const [createCheckoutSession, { isLoading, isSuccess, data, isError ,error}] =
    useCreateCheckoutSessionMutation();

  const purchaseCourseHandler = async () => {
    await createCheckoutSession(courseId);
  };
  useEffect(() => {
if(isSuccess){
  if(data?.url){
    window.location.href = data.url
  }
  else{
    toast.error("Invaild Response form server")
  }

}if(isError){
toast.error(error?.data?.message || "Failed to create checkout page")
}
  },[data, isSuccess, isError, error])
  return (
    <Button
      disabled={isLoading}
      className="w-full bg-purple-600 text-white hover:bg-purple-700"
      onClick={purchaseCourseHandler}
    >
      {isLoading ? (
        <>
          <Loader2 />
          Please wait
        </>
      ) : (
        "Buy Course Now"
      )}
    </Button>
  );
}

export default BuyCourseButton;
