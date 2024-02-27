import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Header from "~/components/Head";
import Navbar from "~/components/Navbar";
import Container from "~/components/Container";
import { Toaster } from "~/components/ui/sonner";
import { Inter as FontSans } from "next/font/google";
import NextNProgress from "nextjs-progressbar";
import SearchInput from "~/components/SearchInput";
import { EdgeStoreProvider } from '../lib/edgestore';
import React, { Suspense } from "react";
import { ThemeProvider } from "next-themes";
import { StoreProvider } from "~/redux/StoreProvider";
import { Skeleton } from "~/components/ui/skeleton";


export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {


  return (

    <SessionProvider session={session}>
      <StoreProvider>
      <EdgeStoreProvider>
      <ThemeProvider attribute="class" themes={['dark', 'light', 'yellow', 'orange', 'blue', 'green']}>
      <Header/>
      

      <div className="w-full min-w-screen h-full min-h-full lg:min-h-screen flex flex-col lg:flex-row bg-main-bg-color font-poppins ">
      <NextNProgress color="#C5C4E3"/>
      <Navbar/>

        <Container direction="row" wid="w-full" classNames="bg-main-bg-color lg:pl-[80px]">
        <div className="w-full min-h-screen flex flex-col items-center justify-evenly px-3 gap-8 ">
          <Suspense fallback={<Skeleton className="w-full lg:w-[350px] h-[40px] rounded-lg"/>}>
            <div className="w-full flex justify-start lg:px-20">
              <SearchInput/>
            </div>
          </Suspense>

            <Component {...pageProps} />  

          <Toaster richColors theme="system"/>  
        </div>
        </Container>

      </div>
      </ThemeProvider>
      </EdgeStoreProvider>
      </StoreProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
