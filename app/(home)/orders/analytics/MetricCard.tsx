import Link from "next/link";
import { motion } from "framer-motion";

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  positive,
  to,
  loading,
}: {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  positive?: boolean;
  to?: string;
  loading?: boolean;
}) {
  const CardContent = (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        bg-white dark:bg-zinc-950 
        rounded-2xl p-4 shadow-sm 
        border border-zinc-200 dark:border-zinc-800 
        flex items-center justify-between
        ${to ? "cursor-pointer hover:shadow-md transition-all" : ""}
      `}
    >
      <div>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-tr from-zinc-50 to-white dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <div className="text-xs text-muted-foreground">{title}</div>
            <div className="text-lg font-semibold mt-1">{value}</div>
            {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
          </div>
        </div>
      </div>

      <div className="text-right">
        <div
          className={`text-sm font-medium ${
            positive ? "text-green-600" : "text-red-500"
          }`}
        >
          {loading ? "…" : positive ? "▲" : "▼"}
        </div>
      </div>
    </motion.div>
  );

  // If "to" exists → wrap in Link (becomes clickable)
  return to ? (
    <Link href={to} className="block">
      {CardContent}
    </Link>
  ) : (
    CardContent
  );
}

export default MetricCard;
