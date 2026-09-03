import { forgotPasswordSchema } from "@/server/auth/auth.schema";
import { forgotUserPassword } from "@/server/auth/auth.service";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = forgotPasswordSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    error: "Invalid request",
                    details: result.error.message,
                },
                { status: 400 }
            );
        }

        await forgotUserPassword(result.data);

        return NextResponse.json(      {
        success: true,
        message: "OTP sent successfully",
      }, { status: 201 });
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

