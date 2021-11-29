import { SignersSection } from "./SignersSection";

export const WalletSettingsView: React.FC = () => {
  return (
    <div tw="w-full">
      <div tw="w-full max-w-2xl mx-auto mt-16">
        <div>
          <h1 tw="text-2xl font-medium">Settings</h1>
          <p tw="text-secondary text-sm font-medium">
            Manage your smart wallet settings
          </p>
        </div>
        <div tw="border-b w-full bg-gray-100 my-6" />
        <SignersSection />
      </div>
    </div>
  );
};
