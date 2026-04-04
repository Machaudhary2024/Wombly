/**
 * Unit tests for chatService and promptRouter.
 * Run with: node tests/chatService.test.js
 * No test framework dependency — uses Node.js assert.
 */

const assert = require("assert");

// ============ promptRouter tests ============
const { buildSystemPrompt, SAFETY_PREAMBLE } = require("../services/promptRouter");

const mockUser = {
  name: "Aisha",
  age: 28,
  height: 165,
  weight: 60,
  pregnancyWeek: 20,
  pregnancyWeekEnteredDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
};

function testPromptRouter() {
  console.log("--- promptRouter tests ---");

  // Test 1: Pregnancy mode includes pregnancy-specific content
  {
    const prompt = buildSystemPrompt({
      user: mockUser,
      mode: "pregnancy",
      intake: { pregnancyWeek: 21 },
      currentWeek: 21,
    });
    assert(prompt.includes("PREGNANCY MODE"), "Pregnancy prompt should contain PREGNANCY MODE");
    assert(prompt.includes("Week 21"), "Pregnancy prompt should contain current week");
    assert(prompt.includes("Aisha"), "Prompt should include user name");
    assert(prompt.includes(SAFETY_PREAMBLE), "Prompt must include safety preamble");
    console.log("  PASS: pregnancy mode prompt");
  }

  // Test 2: Toddler mode includes toddler-specific content
  {
    const prompt = buildSystemPrompt({
      user: mockUser,
      mode: "toddler",
      intake: { toddlerAgeMonths: 18 },
      currentWeek: null,
    });
    assert(prompt.includes("TODDLER MODE"), "Toddler prompt should contain TODDLER MODE");
    assert(prompt.includes("18 months"), "Toddler prompt should contain age");
    assert(!prompt.includes("PREGNANCY MODE"), "Toddler prompt should NOT contain pregnancy mode");
    console.log("  PASS: toddler mode prompt");
  }

  // Test 3: Both mode includes dual-track markers
  {
    const prompt = buildSystemPrompt({
      user: mockUser,
      mode: "both",
      intake: { pregnancyWeek: 21, toddlerAgeMonths: 24 },
      currentWeek: 21,
    });
    assert(prompt.includes("DUAL MODE"), "Both prompt should contain DUAL MODE");
    assert(prompt.includes("24 months"), "Both prompt should contain toddler age");
    assert(prompt.includes("Week 21"), "Both prompt should contain pregnancy week");
    console.log("  PASS: both mode prompt");
  }

  // Test 4: Invalid mode falls back safely
  {
    const prompt = buildSystemPrompt({
      user: mockUser,
      mode: "invalid_mode",
      intake: {},
      currentWeek: null,
    });
    assert(prompt.includes("PREGNANCY MODE"), "Invalid mode should fall back to pregnancy");
    console.log("  PASS: invalid mode fallback");
  }

  // Test 5: Safety preamble is always present
  {
    for (const mode of ["pregnancy", "toddler", "both"]) {
      const prompt = buildSystemPrompt({ user: mockUser, mode, intake: {}, currentWeek: null });
      assert(prompt.includes("NEVER diagnose"), `${mode}: safety preamble missing`);
      assert(prompt.includes("emergency room"), `${mode}: escalation language missing`);
    }
    console.log("  PASS: safety preamble in all modes");
  }

  // Test 6: Prompt injection defense — mode string not inserted raw
  {
    const prompt = buildSystemPrompt({
      user: mockUser,
      mode: "pregnancy",
      intake: {},
      currentWeek: null,
    });
    // The mode value itself should only appear in controlled template text
    assert(!prompt.includes("You are now in pregnancy mode"), "Mode should not be naively interpolated");
    console.log("  PASS: no raw mode interpolation");
  }
}

// ============ Conversation model validation tests ============
function testConversationModel() {
  console.log("\n--- Conversation model tests ---");

  const Conversation = require("../models/Conversation");

  // Test 7: VALID_MODES constant is correct
  assert.deepStrictEqual(
    Conversation.VALID_MODES,
    ["pregnancy", "toddler", "both"],
    "VALID_MODES should be pregnancy, toddler, both"
  );
  console.log("  PASS: valid modes constant");

  // Test 8: VALID_STATUSES constant is correct
  assert.deepStrictEqual(
    Conversation.VALID_STATUSES,
    ["active", "archived"],
    "VALID_STATUSES should be active, archived"
  );
  console.log("  PASS: valid statuses constant");
}

// ============ Message model validation tests ============
function testMessageModel() {
  console.log("\n--- Message model tests ---");

  const Message = require("../models/Message");

  // Test 9: VALID_ROLES constant
  assert.deepStrictEqual(
    Message.VALID_ROLES,
    ["user", "assistant", "system"],
    "VALID_ROLES should be user, assistant, system"
  );
  console.log("  PASS: valid roles constant");
}

// ============ chatService unit tests (no DB required) ============
function testChatServiceHelpers() {
  console.log("\n--- chatService helper tests ---");

  const { calculateCurrentWeek } = require("../services/chatService");

  // Test 10: calculateCurrentWeek with valid data
  {
    const user = {
      pregnancyWeek: 10,
      pregnancyWeekEnteredDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    };
    const result = calculateCurrentWeek(user);
    assert.strictEqual(result, 12, "Should be week 12 (10 + 2 weeks)");
    console.log("  PASS: calculateCurrentWeek normal case");
  }

  // Test 11: calculateCurrentWeek with missing data
  {
    assert.strictEqual(calculateCurrentWeek({}), null, "Missing data should return null");
    assert.strictEqual(calculateCurrentWeek({ pregnancyWeek: 10 }), null, "Missing date should return null");
    console.log("  PASS: calculateCurrentWeek null cases");
  }

  // Test 12: calculateCurrentWeek caps at 42
  {
    const user = {
      pregnancyWeek: 40,
      pregnancyWeekEnteredDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 4+ weeks ago
    };
    const result = calculateCurrentWeek(user);
    assert.strictEqual(result, null, "Week > 42 should return null");
    console.log("  PASS: calculateCurrentWeek overflow cap");
  }
}

// ============ Run all tests ============
try {
  testPromptRouter();
  testConversationModel();
  testMessageModel();
  testChatServiceHelpers();
  console.log("\n=== ALL TESTS PASSED ===");
  process.exit(0);
} catch (err) {
  console.error("\n=== TEST FAILED ===");
  console.error(err.message);
  console.error(err.stack);
  process.exit(1);
}
