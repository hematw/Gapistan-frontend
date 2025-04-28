import { Switch } from "@heroui/switch";
import { useThemeContext } from "../contexts/ThemeContext";
import { MoonIcon, SunIcon } from "lucide-react";

export default function ThemeSwitch() {
  const { toggleTheme, isDark } = useThemeContext();

  return (
    <Switch
      defaultSelected
      isSelected={isDark}
      onClick={toggleTheme}
      color="secondary"
      size="sm"
      onChange={toggleTheme}
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <SunIcon className={className} />
        ) : (
          <MoonIcon className={className} />
        )
      }
    >
      Dark mode
    </Switch>
  );
}
