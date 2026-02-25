// src/components/BabyForm.tsx
import React from "react";
import { useForm } from "react-hook-form";

type FormData = {
  babyName: string;
  babyBday: string;
  motherName: string;
  hospital: string;
  notes?: string;
};

export default function BabyForm() {
  const { register, handleSubmit, reset } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
    alert("Form submitted!");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Baby & Parent Details</h2>
      <input {...register("babyName")} placeholder="Baby Name" required />
      <input type="date" {...register("babyBday")} required />
      <input {...register("motherName")} placeholder="Mother Name" required />
      <input {...register("hospital")} placeholder="Hospital" required />
      <textarea {...register("notes")} placeholder="Notes" />
      <button type="submit">Submit</button>
    </form>
  );
}
