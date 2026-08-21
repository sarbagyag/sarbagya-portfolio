import { Mail, MailOpen } from "lucide-react";
import DeleteButton from "@/components/Admin/DeleteButton";
import { getContactMessages } from "@/lib/api/queries";
import { markMessageRead, deleteMessage } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await getContactMessages();

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-8">Messages</h1>

      <div className="space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-4 border ${
              msg.read ? "border-border-color bg-bg-card" : "border-primary-400 bg-link-subtle"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {msg.read ? (
                    <MailOpen size={14} className="text-text-tertiary shrink-0" />
                  ) : (
                    <Mail size={14} className="text-link shrink-0" />
                  )}
                  <p className="font-semibold text-text-primary truncate">
                    {msg.subject || "(no subject)"}
                  </p>
                </div>
                <p className="text-sm text-text-secondary mt-1">
                  {msg.name} · <a href={`mailto:${msg.email}`} className="hover:text-link transition-colors">{msg.email}</a>
                </p>
                <p className="text-sm text-text-primary mt-3 whitespace-pre-wrap">{msg.message}</p>
                <p className="text-xs text-text-tertiary mt-3">
                  {new Date(msg.createdAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {!msg.read && (
                  <form action={markMessageRead.bind(null, msg.id)}>
                    <button
                      type="submit"
                      className="p-2 text-text-secondary hover:text-link hover:bg-link-subtle transition-colors"
                      aria-label="Mark as read"
                    >
                      <MailOpen size={16} />
                    </button>
                  </form>
                )}
                <DeleteButton action={deleteMessage.bind(null, msg.id)} label="Delete message" />
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 && <p className="text-sm text-text-tertiary">No messages yet.</p>}
      </div>
    </div>
  );
}
