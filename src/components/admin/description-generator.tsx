"use client";

import { useState, useTransition } from "react";
import { Check, Copy, Loader2, Wand2 } from "lucide-react";
import { generateDescriptionAction, type DescribeInput } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const tones = ["Elegant", "Friendly", "Professional", "Playful", "Romantic"];

export function DescriptionGenerator({ categories }: { categories: string[] }) {
  const [input, setInput] = useState<DescribeInput>({
    productName: "",
    productCategory: categories[0] ?? "",
    keyFeatures: "",
    targetAudience: "Women shopping for gifts in Bangladesh",
    tone: tones[0],
  });
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  const set = (key: keyof DescribeInput) => (value: string) => setInput((prev) => ({ ...prev, [key]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const res = await generateDescriptionAction(input);
      if (res.ok) setResult(res.description);
      else setError(res.error);
    });
  };

  const copy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="ai-name">Product name</Label>
        <Input id="ai-name" value={input.productName} onChange={(e) => set("productName")(e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={input.productCategory} onValueChange={set("productCategory")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Tone</Label>
          <Select value={input.tone} onValueChange={set("tone")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tones.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="ai-features">Key features</Label>
        <Textarea
          id="ai-features"
          rows={3}
          placeholder="Gold-plated, adjustable chain, gift box included…"
          value={input.keyFeatures}
          onChange={(e) => set("keyFeatures")(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ai-audience">Target audience</Label>
        <Input id="ai-audience" value={input.targetAudience} onChange={(e) => set("targetAudience")(e.target.value)} required />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
        Generate description
      </Button>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {result && (
        <div className="space-y-2 rounded-lg border bg-secondary/40 p-4">
          <p className="whitespace-pre-line text-sm leading-relaxed">{result}</p>
          <Button type="button" variant="outline" size="sm" onClick={copy}>
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      )}
    </form>
  );
}
