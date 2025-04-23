import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { memo, useState } from "react";

function PassInput(props) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Input
      {...props}
      type={isVisible ? "text" : "password"}
      endContent={
        <Button
          isIconOnly
          variant="light"
          onPress={() => setIsVisible(!isVisible)}
        >
          {isVisible ? (
            <EyeOffIcon className="w-6 h-6 cursor-pointer" />
          ) : (
            <EyeIcon className="w-6 h-6 cursor-pointer" />
          )}
        </Button>
      }
    />
  );
}

export default memo(PassInput);
