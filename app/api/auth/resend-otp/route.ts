import { resendOtpSchema } from "@/server/auth/auth.schema";
import { createUserSchema } from "@/server/user/user.schema";
import { createUser, resendOtp } from "@/server/user/user.service";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = resendOtpSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    error: "Invalid request",
                    details: result.error.message,
                },
                { status: 400 }
            );
        }

        const user = await resendOtp(result.data);

        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        if (error instanceof Error && error.message === "Email already in use") {
            return NextResponse.json(
                { error: error.message },
                { status: 409 }
            );
        }

        console.error(error);

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

