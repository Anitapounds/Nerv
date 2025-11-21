"use client";

import { Button } from "@/components/ui/button";
import {
  ConnectModal,
  useCurrentAccount,
  useDisconnectWallet,
} from "@onelabs/dapp-kit";
import { useRouter, usePathname } from "next/navigation";
import { ComponentProps, MouseEvent, useEffect, useState } from "react";

type ButtonProps = ComponentProps<typeof Button>;

interface WalletConnectButtonProps extends ButtonProps {
  labelWhenDisconnected?: string;
}

export default function WalletConnectButton({
  labelWhenDisconnected = "Connect Wallet",
  children,
  disabled,
  onClick,
  type = "button",
  ...rest
}: WalletConnectButtonProps) {
  const currentAccount = useCurrentAccount();
  const { mutate: disconnect, isPending: isDisconnecting } = useDisconnectWallet();
  const router = useRouter();
  const pathname = usePathname();
  const [hasRedirected, setHasRedirected] = useState(false);

  const connectedLabel =
    currentAccount?.address && children === undefined
      ? `${currentAccount.address.slice(0, 6)}...${currentAccount.address.slice(-4)}`
      : children ?? labelWhenDisconnected;

  // Pages where we should NOT redirect after wallet connection
  const noRedirectPages = ['/developerforgame', '/developer', '/profile'];

  useEffect(() => {
    // Only redirect if on login page or root, not on pages where user is doing something
    const shouldRedirect = !noRedirectPages.includes(pathname) && pathname !== '/';

    if (currentAccount && !hasRedirected && !noRedirectPages.includes(pathname)) {
      setHasRedirected(true);
      // Only redirect from login-type pages
      if (pathname === '/login' || pathname === '/') {
        router.push("/dashboard");
      }
    }

    if (!currentAccount && hasRedirected) {
      setHasRedirected(false);
    }
  }, [currentAccount, hasRedirected, router, pathname]);

  if (currentAccount) {
    const handleDisconnect = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);

      if (event.defaultPrevented) {
        return;
      }

      disconnect();
    };

    return (
      <Button
        type={type}
        {...rest}
        onClick={handleDisconnect}
        disabled={disabled || isDisconnecting}
      >
        {isDisconnecting ? "Disconnecting..." : connectedLabel}
      </Button>
    );
  }

  return (
    <ConnectModal
      trigger={
        <Button type={type} {...rest} disabled={disabled}>
          {children ?? labelWhenDisconnected}
        </Button>
      }
    />
  );
}
