import {Injectable} from "@nestjs/common";
import {customAlphabet} from "nanoid";

type IDType =
  | "pk_test"
  | "sk_test"
  | "pk_live"
  | "sk_live"
  | "cus"
  | "com"
  | "pos"
  | "bun"
  | "tx";

@Injectable()
export class UniqueID {
  private alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  public generate(type: IDType) {
    switch (type) {
      case "pk_test":
        return "pk_test_" + customAlphabet(this.alphabet, 46)();
      case "sk_test":
        return "sk_test_" + customAlphabet(this.alphabet, 46)();
      case "pk_live":
        return "pk_live_" + customAlphabet(this.alphabet, 46)();
      case "sk_live":
        return "sk_live_" + customAlphabet(this.alphabet, 46)();
      case "cus":
        return "cus_" + customAlphabet(this.alphabet, 22)();
      case "com":
        return "com_" + customAlphabet(this.alphabet, 22)();
      case "pos":
        return "pos_" + customAlphabet(this.alphabet, 22)();
      case "bun":
        return "bun_" + customAlphabet(this.alphabet, 22)();
      case "tx":
        return "tx_" + customAlphabet(this.alphabet, 22)();
      default:
        return customAlphabet(this.alphabet, 46)();
    }
  }
}
