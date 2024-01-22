import React from "react";
import { Stack, Text } from "tamagui";

type Props = { children: React.ReactNode; title: string };

const Section = ({ children, title }: Props) => {
  return (
    <Stack space>
      <Text fontSize="$6" fontWeight="bold">
        {title}
      </Text>
      {children}
    </Stack>
  );
};

export default Section;
