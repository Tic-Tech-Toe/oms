import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrency } from "@/hooks/useCurrency";
import { Plus, Trash2 } from "lucide-react";

export type Charge = {
  id: string;
  name: string;
  type: "amount" | "percent";
  value: number;
};

export default function ChargesEditor({ charges, onChange, subtotal }: { charges: Charge[]; onChange: (c: Charge[]) => void; subtotal: number }) {
    return (
        <div className="space-y-3">
            {charges.map((c) => {
                const computed = c.type === "percent" ? (subtotal * (c.value || 0)) / 100 : c.value || 0;
                return (
                    <div key={c.id} className="flex items-center gap-3">
                        <Input
                            value={c.name}
                            onChange={(e) => onChange(charges.map((x) => (x.id === c.id ? { ...x, name: e.target.value } : x)))}
                            className="flex-1"
                            placeholder="Charge name (eg. GST or Delivery)"
                        />
                        <div className="flex items-center gap-2">
                            <select
                                value={c.type}
                                onChange={(e) => onChange(charges.map((x) => (x.id === c.id ? { ...x, type: e.target.value as Charge["type"] } : x)))}
                                className="rounded-md border px-2 py-1 bg-transparent h-10"
                            >
                                <option value="amount">₹</option>
                                <option value="percent">%</option>
                            </select>

                            <Input
                                type="number"
                                min={0}
                                value={String(c.value)}
                                onChange={(e) =>
                                    onChange(charges.map((x) => (x.id === c.id ? { ...x, value: parseFloat(e.target.value || "0") } : x)))
                                }
                                className="w-28 text-right"
                            />
                        </div>

                        <div className="w-28 text-right font-medium">{useCurrency(computed)}</div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onChange(charges.filter((x) => x.id !== c.id))}
                            className="text-red-500"
                            aria-label={`Remove ${c.name}`}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            })}

            <div className="pt-1">
                <Button
                    variant="ghost"
                    onClick={() =>
                        onChange([
                            ...charges,
                            { id: `c-${Date.now()}-${Math.floor(Math.random() * 9999)}`, name: "Charge", type: "amount", value: 0 },
                        ])
                    }
                    className="flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" /> Add charge
                </Button>
            </div>
        </div>
    );
}