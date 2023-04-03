import React from "react";
import { AppProps } from "next/app";
import type { NextPage } from "next";
import { Refine, GitHubBanner } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import {
  notificationProvider,
  RefineThemes,
  ThemedLayout,
} from "@refinedev/chakra-ui";
import routerProvider, {
  UnsavedChangesNotifier,
} from "@refinedev/nextjs-router";

import dataProvider, { GraphQLClient } from "@refinedev/hasura";
import { ChakraProvider } from "@chakra-ui/react";
import { Header } from "@components/header";

const API_URL = "https://imumz-admin.hasura.app/v1/graphql";

const client = new GraphQLClient(API_URL, {
  headers: {
    "x-hasura-role": "public",
  },
});
const idTypeMap: Record<string, any> = {
  tab_temp: "Int",
};

const gqlDataProvider = dataProvider(client, {
  idType: (resource) => idTypeMap[resource] ?? "uuid",
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  noLayout?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout): JSX.Element {
  const renderComponent = () => {
    if (Component.noLayout) {
      return <Component {...pageProps} />;
    }

    return (
      <ThemedLayout Header={Header}>
        <Component {...pageProps} />
      </ThemedLayout>
    );
  };

  return (
    <>
      <RefineKbarProvider>
        {/* You can change the theme colors here. example: theme={RefineThemes.Magenta} */}
        <ChakraProvider theme={RefineThemes.Blue}>
          <Refine
            routerProvider={routerProvider}
            dataProvider={gqlDataProvider}
            notificationProvider={notificationProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
            resources={[
              {
                name: "tab_temp",
                list: "/tab_temps",
                show: "/tab_temps/show/:id",
                create: "/tab_temps/create",
                edit: "/tab_temps/edit/:id",
              },
            ]}
          >
            {renderComponent()}
            <RefineKbar />
            <UnsavedChangesNotifier />
          </Refine>
        </ChakraProvider>
      </RefineKbarProvider>
    </>
  );
}

export default MyApp;
