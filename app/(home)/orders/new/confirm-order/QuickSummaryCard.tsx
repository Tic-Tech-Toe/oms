import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useCurrency } from "@/hooks/useCurrency";

const QuickSummaryCard = ({ itemsCount, subtotal, totalCharges, totalAmount }: { itemsCount: number; subtotal: number; totalCharges: number; totalAmount: number; }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between">
                    <span>Items ({itemsCount})</span>
                    <span>{useCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between mt-1">
                    <span>Charges</span>
                    <span>{useCurrency(totalCharges)}</span>
                </div>
                <div className="flex justify-between mt-3 font-semibold border-t pt-2">
                    <span>Grand Total</span>
                    <span>{useCurrency(totalAmount)}</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default QuickSummaryCard;