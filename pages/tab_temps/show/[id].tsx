import { HttpError, useShow } from "@refinedev/core";
import {
  HStack,
  Box,
  Button,
  Flex,
  Text,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useDisclosure,
} from "@chakra-ui/react";
import { useModalForm } from "@refinedev/react-hook-form";
import { Show } from "@refinedev/chakra-ui";

export type ITabTemp = {
  id: number;
  name: string;
};

function UpdateNameComponent() {
  const {
    formState: { errors },
    refineCore: { onFinish, formLoading },
    modal: { visible, close, show },
    register,
    handleSubmit,

    saveButtonProps,
  } = useModalForm<ITabTemp, HttpError, ITabTemp>({
    refineCoreProps: {
      action: "edit",
      meta: {
        fields: ["name"],
      },
    },
  });

  return (
    <>
      <Button onClick={() => show()} colorScheme="teal">
        Update Name
      </Button>
      <Drawer isOpen={visible} placement="right" onClose={close} size={"md"}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Update Name:</DrawerHeader>

          <DrawerBody>
            <form onSubmit={handleSubmit(onFinish)}>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                  id="name"
                  placeholder="name"
                  {...register("name", {
                    required: "This is required",
                    minLength: {
                      value: 4,
                      message: "Minimum length should be 4",
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>
              <Button
                mt={4}
                colorScheme="teal"
                isLoading={formLoading}
                type="submit"
              >
                Submit
              </Button>
            </form>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={close}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default function ShowEscalation() {
  const {
    queryResult: { data, isLoading },
  } = useShow<ITabTemp>({
    meta: {
      fields: ["id", "name"],
    },
  });
  const escalationData = data?.data;
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!escalationData) {
    return <Text>Error loading escalation data.</Text>;
  }
  return (
    <div>
      <Show
        canEdit={false}
        headerButtons={({}) => (
          <HStack>
            <UpdateNameComponent></UpdateNameComponent>
          </HStack>
        )}
      >
        <Text>{data.data.id}</Text>
        <Text>{data.data.name}</Text>
      </Show>
    </div>
  );
}
