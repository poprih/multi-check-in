"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gender } from "@prisma/client";
import { Switch } from "./ui/switch";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  gender: z.enum([Gender.Female, Gender.Male], {
    required_error: "You need to select a notification type.",
  }),
  fellow: z.boolean(),
});
export type MemberFormValues = z.infer<typeof formSchema>;
interface MemberFormProps {
  onSubmit: (values: MemberFormValues) => void;
}
const MemberForm: React.FC<MemberFormProps> = ({ onSubmit }) => {
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "usd",
      gender: Gender.Male,
      fellow: true,
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        id="member"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>姓名</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>性別</FormLabel>
              <FormControl>
                <RadioGroup
                  defaultValue={field.value}
                  className="flex"
                  onValueChange={field.onChange}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={Gender.Male} />
                    <Label>弟兄</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={Gender.Female} />
                    <Label>姊妹</Label>
                  </div>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fellow"
          render={({ field }) => (
            <FormItem>
              <FormLabel>同工</FormLabel>
              <FormControl>
                <Switch
                  className="ml-2"
                  onCheckedChange={field.onChange}
                  checked={field.value}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default MemberForm;
