import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { Link } from "react-router-dom";

interface RegisterFormProps extends React.ComponentProps<"div"> {
    onFormSubmit?: (data: FormData) => void;
}

export function RegisterForm({
    className,
    onFormSubmit,
    ...props
}: RegisterFormProps) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        if (onFormSubmit) {
            onFormSubmit(formData);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Sign in your account</CardTitle>
                    <CardDescription>
                        Enter your email below to sign in your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    // type="email"
                                    type="text"
                                    name="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">
                                        Password
                                    </FieldLabel>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                />
                            </Field>
                            <Field>
                                <Button type="submit">Sign In</Button>
                                <FieldDescription className="text-center">
                                    Already have an account?{" "}
                                    <Link to="/login" className="underline">
                                        Log in
                                    </Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
