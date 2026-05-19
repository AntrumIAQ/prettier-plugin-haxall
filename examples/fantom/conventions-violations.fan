// Test file with deliberate Fantom convention violations.
// Expected: formatter rewrites these to match conventions-expected.fan

class ConventionViolations
{
  // Violation 1: trailing semicolons on statements
  Void testSemicolons()
  {
    x := 1;
    y := x + 2;
    if (y > 0)
    {
      echo(y);
    }
  }

  // Violation 2: zero-arg method calls should omit ()
  Void testZeroArgCalls()
  {
    name := toStr()
    size := list.size()
    result := compute()
    lines := readAllLines()
  }

  // Violation 3: single-statement method should omit return
  Str greeting()
  {
    return "hello"
  }

  Int answer()
  {
    return 42
  }

  Bool isEmpty()
  {
    return size() == 0
  }

  // Violation 1+2 combined: semicolons AND zero-arg calls
  Void testCombined()
  {
    n := size();
    s := name();
    echo(s);
  }

  // No violation: for loop with semicolons inside header (must be preserved)
  Void testForLoop()
  {
    for (i := 0; i < 10; i++)
    {
      echo(i)
    }
  }

  // No violation: multiline for loop (semicolons inside paren — must be preserved)
  Void testMultilineFor()
  {
    for (i := 0;
         i < 10;
         i++)
    {
      echo(i)
    }
  }

  // No violation: one-liner (already correct)
  Str name() { return "test" }

  // No violation: Void method should keep return keyword (return with no value)
  Void doStuff()
  {
    if (x) return
    doOther()
  }

  // Helper fields
  Int x := 0
  Str[] list := Str[,]
}
