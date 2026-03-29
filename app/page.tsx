"use client";

import ScanoLayout from "./components/ScanoLayout";
import PdfUpload from "./components/PdfUpload";

export default function Home() {
  return (
    <ScanoLayout>
      <PdfUpload />
    </ScanoLayout>
  );
}
