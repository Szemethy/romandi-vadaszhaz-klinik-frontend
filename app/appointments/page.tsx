"use client";

import React, { useEffect, useState } from "react";
import Header from "@/app/header/page";
import { useGlobalStore } from "@/store/globalStore";

export default function AppointmentsPage() {
    return (
        <div className="min-h-screen bg-[#36483D] text-[#A89D62]">
            <Header />
        </div>
    );
}